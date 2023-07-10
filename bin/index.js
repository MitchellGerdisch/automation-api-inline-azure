"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const automation_1 = require("@pulumi/pulumi/automation");
const resources_1 = require("@pulumi/azure-native/resources");
const storage_1 = require("@pulumi/azure-native/storage");
const process = require('process');
const args = process.argv.slice(2);
let destroy = false;
if (args.length > 0 && args[0]) {
    destroy = args[0] === "destroy";
}
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    // This is our pulumi program in "inline function" form
    const pulumiProgram = () => __awaiter(void 0, void 0, void 0, function* () {
        // Create an Azure Resource Group
        const resourceGroup = new resources_1.resources.ResourceGroup("resourceGroup");
        // Create an Azure resource (Storage Account)
        const storageAccount = new storage_1.storage.StorageAccount("sa", {
            resourceGroupName: resourceGroup.name,
            sku: {
                name: storage_1.storage.SkuName.Standard_LRS,
            },
            kind: storage_1.storage.Kind.StorageV2,
        });
        const storageAccountKeys = storage_1.storage.listStorageAccountKeysOutput({
            resourceGroupName: resourceGroup.name,
            accountName: storageAccount.name
        });
        return {
            primaryStorageKey: storageAccountKeys.keys[0].value,
        };
    });
    // Create our stack 
    const args = {
        stackName: "dev",
        projectName: "inlineNode",
        program: pulumiProgram
    };
    // create (or select if one already exists) a stack that uses our inline program
    const stack = yield automation_1.LocalWorkspace.createOrSelectStack(args);
    console.info("successfully initialized stack");
    console.info("installing plugins...");
    yield stack.workspace.installPlugin("aws", "v4.0.0");
    console.info("plugins installed");
    console.info("setting up config");
    yield stack.setConfig("aws:region", { value: "us-west-2" });
    console.info("config set");
    console.info("refreshing stack...");
    yield stack.refresh({ onOutput: console.info });
    console.info("refresh complete");
    if (destroy) {
        console.info("destroying stack...");
        yield stack.destroy({ onOutput: console.info });
        console.info("stack destroy complete");
        process.exit(0);
    }
    console.info("updating stack...");
    const upRes = yield stack.up({ onOutput: console.info });
    console.log(`update summary: \n${JSON.stringify(upRes.summary.resourceChanges, null, 4)}`);
    console.log(`storageKey: ${upRes.outputs.primaryStorageKey.value}`);
});
run().catch(err => console.log(err));
//# sourceMappingURL=index.js.map