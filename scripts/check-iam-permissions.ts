import "dotenv/config";
import { IAMClient, ListUserPoliciesCommand, GetUserPolicyCommand, GetUserCommand } from "@aws-sdk/client-iam";

async function checkIAMPermissions() {
  try {
    console.log("🔍 Checking IAM permissions for user...\n");

    const iamClient = new IAMClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });

    // Get user info
    const userCommand = new GetUserCommand({});
    const userResponse = await iamClient.send(userCommand);
    console.log("✅ Current User:");
    console.log(`   ARN: ${userResponse.User?.Arn}`);
    console.log(`   Username: ${userResponse.User?.UserName}\n`);

    // List inline policies
    const listCommand = new ListUserPoliciesCommand({
      UserName: userResponse.User?.UserName!,
    });
    const policiesResponse = await iamClient.send(listCommand);
    
    console.log("📋 Inline Policies Attached:");
    if (!policiesResponse.PolicyNames || policiesResponse.PolicyNames.length === 0) {
      console.log("   ❌ No inline policies found!");
    } else {
      policiesResponse.PolicyNames.forEach((policy) => {
        console.log(`   ✅ ${policy}`);
      });
    }

    // Get policy details
    if (policiesResponse.PolicyNames && policiesResponse.PolicyNames.length > 0) {
      console.log("\n📜 Policy Details:");
      for (const policyName of policiesResponse.PolicyNames) {
        const policyCommand = new GetUserPolicyCommand({
          UserName: userResponse.User?.UserName!,
          PolicyName: policyName,
        });
        const policyResponse = await iamClient.send(policyCommand);
        console.log(`\n   Policy: ${policyName}`);
        console.log(
          "   Content:",
          JSON.stringify(
            JSON.parse(decodeURIComponent(policyResponse.PolicyDocument!)),
            null,
            2
          )
        );
      }
    }

    console.log("\n🎯 Expected S3 permissions should include:");
    console.log("   - s3:PutObject");
    console.log("   - s3:GetObject");
    console.log("   - s3:DeleteObject");
    console.log("   - s3:ListBucket");
  } catch (error) {
    console.error("❌ Error checking permissions:", error);
    process.exit(1);
  }
}

checkIAMPermissions();
