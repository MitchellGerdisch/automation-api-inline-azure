# automation api with inline azure-native 
Some test code to dig into a heap issue.

# Azure-Native v1
* Set up package.json:     
  * "@pulumi/azure-native": "^1.0.0",
* npm i
* npm start
  * This will result in a heap error on my 16GB mac

# Azure-Native v2
* Set up package.json:     
  * "@pulumi/azure-native": "^2.0.0-beta.1",
* npm i
* npm start
  * This will run successfully.

