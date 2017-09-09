#!/bin/bash

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $script_dir



OERID=`cat ./openexchangerates.txt`
curl -sS https://openexchangerates.org/api/latest.json?app_id=$OERID > data/openexchangerates_latest.txt

echo 'end'
