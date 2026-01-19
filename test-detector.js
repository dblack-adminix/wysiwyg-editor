// Быстрый тест детектора
const code = `provider "aws" {
  region = "eu-west-1"
}

resource "aws_s3_bucket" "logs" {
  bucket = "my-logs"
}

{"ip":"10.0.0.1","status":200}
{"ip":"10.0.0.2","status":500}`;

console.log('Testing code detection...');
console.log('Code length:', code.length);
console.log('Code preview:', code.substring(0, 100));

// Симуляция детектора
const hasProvider = /provider\s+"aws"/.test(code);
const hasResource = /resource\s+"aws_/.test(code);
const hasJSON = /\{"ip":/.test(code);

console.log('\nPatterns found:');
console.log('- provider "aws":', hasProvider);
console.log('- resource "aws_:', hasResource);
console.log('- JSON lines:', hasJSON);

if (hasProvider && hasResource) {
  console.log('\n✅ Should detect as: terraform');
} else if (hasJSON) {
  console.log('\n✅ Should detect as: jsonl or json');
} else {
  console.log('\n❌ Might not detect correctly');
}
