#!/bin/bash

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $script_dir

node make-discovery.js
