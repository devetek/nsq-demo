#!/bin/bash

printf "\n<GroupedLog>\n"
printf "Initial setups (...)\n"

echo " _        __       "
echo "(_)_ __  / _| ___  "
echo "| | '_ \\| |_ / _ \\ "
echo "| | | | |  _| (_) |"
echo "|_|_| |_|_|  \\___/ "
echo "                   "
echo "=========================================================================="
echo "Common Module       : Global Config"
echo "Repository          : github.com/creativetimofficial/nextjs-material-kit"
echo "Creator             : prakasa@devetek.com"
echo "Full Source Dir     : ."
echo "=========================================================================="
echo ""
printf "\n</GroupedLog>\n"


# Title       : Git Command
# Author      : Nedya Prakasa
# Date        : 02 Dec 2021
# Description : Git command to handle folder and head condition
# Example repo failed build https://github.com/jovimoura/ecommerce-next.git
printf "\n<GroupedLog>\n"
printf "Initial setups folder and git head (...)\n"
if [ ! -d /root/nextjs-material-kit ]; then
    git clone https://github.com/creativetimofficial/nextjs-material-kit.git
fi

cd nextjs-material-kit
printf "\n</GroupedLog>\n"


# Title       : Install All Local Deps
# Author      : Nedya Prakasa
# Date        : 02 Dec 2021
# Description : Install all require local dependencies
printf "\n<GroupedLog>\n"
printf "Install local dependencies\n"
yarn
printf "\n</GroupedLog>\n"

# Title       : Install Service
# Author      : Nedya Prakasa
# Date        : 02 Dec 2021
# Description : Install services can execute multiple command, such us (cp config.example .env && yarn build)
printf "\n<GroupedLog>\n"
printf "Install services\n"
yarn build
printf "\n</GroupedLog>\n"

echo "KRATOS-FINISHED"
