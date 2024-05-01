#!/usr/bin/env python3
#
# Copyright (c) 2022 - Indigen Solutions
# Authors:
# - David PISTORI <david.pistori@indigen.com>
# - Alexandre DE FREITAS MARTINS <alexandre.defreitasmartins@indigen.com>
# NOTICE: All information contained here is, and remains
# the property of Indigen Solutions and its suppliers, if any.
# Dissemination of this information or reproduction of this material
# is strictly forbidden unless prior written permission is obtained
# from Indigen Solutions.
#

import os
import sys
import json

header = ""
isHeader = ""
vueHeader = ""
isVueHeader = ""

def vueHeaderFile(file):
    print("File: " + file)
    f = open(file, "r")
    content = f.read()
    f.close()
    if not content.startswith(isVueHeader):
        print("Add header")
        f = open(file, "w")
        f.write(vueHeader)
        f.write(content)
        f.close()

def headerFile(file):
    print("File: " + file)
    f = open(file, "r")
    content = f.read()
    f.close()
    if not content.startswith(isHeader):
        print("Add header")
        f = open(file, "w")
        f.write(header)
        f.write(content)
        f.close()

def setHeadersToString():
    global header
    global isHeader
    global vueHeader
    global isVueHeader

    # Get the header from header.json
    headers = json.loads(open("header.json").read())
    # Convert the isHeader to string
    for line in headers["isHeader"]:
        isHeader += line + "\n"
    # Convert the isVueHeader to string
    for line in headers["isVueHeader"]:
        isVueHeader += line + "\n"
    # Convert Classic Header to string
    for line in headers["header"]:
        header += line + "\n"
    # Convert Vue Header to string
    for line in headers["vueHeader"]:
        vueHeader += line + "\n"

def help(length):
    if length != 2:
        print("Usage: ./header.py <path>")
        sys.exit(84)
    if length == 2 and sys.argv[1] == "-h":
        print("USAGE")
        print("    ./header f")
        print("\n")
        print("DESCRIPTION")
        print("    f   file or directory")
        sys.exit(84)
    if not (os.path.isfile(sys.argv[1])) and not os.path.isdir(sys.argv[1]) :
        print("Wrong file or directory name !")
        print("Please use -h for help")
        sys.exit(84)

def main():
    help(len(sys.argv))
    setHeadersToString()
    path = sys.argv[1]
    # Check if the argument is a file or a directory
    if os.path.isfile(path) or os.path.isdir(path):
        # Get the list of files recursively from current directory except node_modules
        files = [os.path.join(dp, f) for dp, dn, filenames in os.walk(path) for f in filenames if not ("node_modules") in dp and not (".git") in dp and (os.path.splitext(f)[1] == '.vue' or os.path.splitext(f)[1] == '.ts')]
        for file in files:
            # Check if it is a vue file
            if file.endswith(".vue"):
                vueHeaderFile(file)
            # Check if it is a typescript file
            elif file.endswith(".ts"):
                headerFile(file)


main()
