import sys
import json
import subprocess
import urllib.request
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


# function to suicide process
def suicide():
    url = 'http://localhost:8080/kill'
    f = urllib.request.urlopen(url)
    print(f.read().decode('utf-8'))


# function executed in a child process
def task():
    try:
        return_code = None
        process = subprocess.run(
            ('./vm-runner.sh'), stdout=sys.stdout.buffer, stderr=sys.stdout.buffer)

        if process.returncode != 0:
            print("[BASH-ERROR] - KRATOS-FINISHED")
            suicide()
            return False

        if process.returncode == 0:
            print("[TASK-SUCCESS] - KRATOS-FINISHED")

        suicide()
        return True
    except Exception as e:
        print("error:", e)
        print("[TASK-ERROR] - KRATOS-FINISHED")
        raise
        suicide()


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
        # configure child processes, with only 1 process
        children = [Process(target=task, name="kratos") for _ in range(1)]
        # start child processes
        for child in children:
            child.start()

        webServer.serve_forever()
    except KeyboardInterrupt:
        raise
    except Exception as e:
        print("error:", e)
        raise
