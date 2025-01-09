import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import { openApiSchema } from "../src/openapi";

async function main() {
  try {
    // OpenAPIスキーマをYAML形式に変換
    const yamlContent = yaml.dump(openApiSchema, {
      indent: 2,
      lineWidth: -1, // 行の折り返しを無効化
      noRefs: false, // 参照を保持
    });

    // YAMLファイルをルートディレクトリに保存
    await fs.writeFile("openapi.yaml", yamlContent, "utf8");

    console.log("✅ OpenAPI documentation generated successfully!");
    console.log("📄 File location: ./openapi.yaml");
  } catch (error) {
    console.error("❌ Error generating OpenAPI documentation:", error);
    process.exit(1);
  }
}

main();
