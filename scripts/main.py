import sys
import json
import subprocess
from multiprocessing import active_children
from multiprocessing import Process
from http.server import BaseHTTPRequestHandler, HTTPServer

# function to get child process by name


def get_process_pid_by_name(name):
    # get all child processes
    processes = active_children()
    # return the process with the name
    for process in processes:
        # check for match
        if process.name == name:
            return process.pid
    # no match
    return None


def exit_gracefully():
    print("I'm hit by someone...")

# function executed in a child process


def task():
    return_code = None
    process = subprocess.Popen(
        "./scripts/vm-runner.sh", stdout=subprocess.PIPE)
    while return_code is None:
        # print(process.pid)
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            output_str = output.strip().decode("utf-8")
            if output_str != "KRATOS-FINISHED":
                print(output.strip().decode("utf-8"))
            else:
                return_code = 0

# Create Public Endpoint To Communicate With Manager


class HTTPServerVMAgent(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api":
            # get the child process pid by name
            pid = get_process_pid_by_name('kratos')
            dictionary = {
                "process": {
                    "pid": pid if pid else 0,
                    "name": "kratos" if pid else "",
                }
            }
            json_object = json.dumps(dictionary)

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(json_object, "utf-8"))
        elif self.path == "/kill":
            self.send_response(200)
            self.end_headers()
            self.send_header("Content-type", "text/html")
            self.wfile.write(bytes("Ok!", "utf-8"))
            sys.exit()
        else:
            self.send_response(403)
            self.end_headers()
            self.send_header("Content-type", "text/html")
            self.wfile.write(bytes("", "utf-8"))

    def log_message(self, format, *args):
        return


# protect the entry point
if __name__ == '__main__':
    webServer = HTTPServer(("0.0.0.0", 8080), HTTPServerVMAgent)
    print("Server started http://%s:%s" % ("0.0.0.0", 8080))

    try:
        # configure child processes
        children = [Process(target=task, name="kratos") for _ in range(1)]
        # start child processes
        for child in children:
            child.start()

        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    # webServer.server_close()
