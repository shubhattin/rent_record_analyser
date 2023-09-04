#!/usr/bin/env python3

import shubhlipi as sh

for x in sh.argv:
    if x == "push":
        sh.cmd(
            "pipenv requirements --exclude-markers > requirements.txt", display=False
        )
        fl = sh.read("./requirements.txt")
        fl = fl.replace("-i https://pypi.org/simple\n", "")
        sh.write("./src/requirements.txt", fl)
        sh.delete_file("./requirements.txt")
        sh.cmd("space push", direct=False)
