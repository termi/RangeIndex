#!/bin/sh
cd ..

rm -rf build/npm
mkdir build/npm

git archive master -o build/npm/rangeindex.tar --prefix=rangeindex/

cd build/npm

tar xf rangeindex.tar && rm rangeindex.tar

cd rangeindex
rm .gitignore

cd build
./build.sh

cd ../..
tar czf rangeindex.tgz rangeindex && rm -rf rangeindex

echo 'tgz file: build/npm/rangeindex.tgz'
