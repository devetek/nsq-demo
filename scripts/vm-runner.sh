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
echo "Repository          : github.com/skipfortoday/next13-tailwind-typescript-starter"
echo "Creator             : prakasa@devetek.com"
echo "Full Source Dir     : ."
echo "=========================================================================="
echo ""
printf "\n</GroupedLog>\n"


# Title       : Git Command
# Author      : Nedya Prakasa
# Date        : 02 Dec 2021
# Description : Git command to handle folder and head condition
printf "\n<GroupedLog>\n"
printf "Initial setups folder and git head (...)\n"
git clone https://github.com/skipfortoday/next13-tailwind-typescript-starter.git

cd next13-tailwind-typescript-starter
printf "\n</GroupedLog>\n"


# Title       : Install All Local Deps
# Author      : Nedya Prakasa
# Date        : 02 Dec 2021
# Description : Install all require local dependencies
printf "\n<GroupedLog>\n"
printf "Install local dependencies\n"
yarn install
printf "\n</GroupedLog>\n"

# Title       : Install Service
# Author      : Nedya Prakasa
# Date        : 02 Dec 2021
# Description : Install services can execute multiple command, such us (cp config.example .env && yarn build)
printf "\n<GroupedLog>\n"
printf "Install services\n"
yarn run build
printf "\n</GroupedLog>\n"

echo "KRATOS-FINISHED"
