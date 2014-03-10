#!/bin/sh
cd ..

rm -rf build/npm
mkdir build/npm

git archive master -o build/npm/range-index.tar --prefix=range-index/

cd build/npm

tar xf range-index.tar && rm range-index.tar

cd range-index
rm .gitignore

cd build
./build.sh

cd ../..
tar czf range-index.tgz range-index && rm -rf range-index
