import fs from "fs/promises";

async function main()
{
  const dependencies: Dependency[] = (await getDependencies()).filter((i) => i.name !== "database");
  const external: string[] = dependencies.map((i) => i.name);

  await Bun.build({
    entrypoints: ["./src/index.ts"],
    splitting: true,
    minify: true,
    target: "bun",

    external,
    plugins: buildPlugins(),

    tsconfig: "./tsconfig.json",
    outdir: "./dist"
  });

  const dependencyPackage: any = {};
  dependencies.forEach((value) => dependencyPackage[value.name] = value.version);

  const packageStructure: any = {name: "backend", main: "./index.js", dependencies: dependencyPackage};
  await Bun.write("./dist/package.json", JSON.stringify(packageStructure));

  await Bun.$`pnpm install  --ignore-scripts --dir ./dist --ignore-workspace`;
}

function buildPlugins(): Bun.BunPlugin[]
{
  return [{
    name: "clean_outdir",
    setup(build: Bun.PluginBuilder)
    {
      build.onStart(async () =>
      {
        const outdir: string | undefined = build.config?.outdir;
        if (!outdir || !(await fs.exists(outdir)))
        {
          return;
        }

        await fs.rm(outdir, {recursive: true, force: true});
        await fs.mkdir(outdir);
      });
    }
  }, {
    name: "vervoseFiles",
    setup(build: Bun.PluginBuilder)
    {
      build.onLoad({filter: /.*/}, (args) =>
      {
        console.log(args.path);
        return undefined;
      });
    }
  }, {
    name: "copyAssets",
    setup(build: Bun.PluginBuilder)
    {
      build.onEnd(async (result) =>
      {
        await fs.cp("./assets", "./dist/assets", {recursive: true, force: true});
      });
    }
  }];
}

async function getDependencies(): Promise<Dependency[]>
{
  const data: any[] = await Bun.$`pnpm list --filter . --depth Infinity --json`.json();

  const workspace: any = data[0];
  if (!workspace)
  {
    return [];
  }

  const dependencies: Dependency[] = [];

  function walk(deps: Record<string, any>)
  {
    for (const [name, info] of Object.entries(deps))
    {
      dependencies.push({name, version: info.version});

      if (info.dependencies)
      {
        walk(info.dependencies);
      }
    }
  }

  walk(workspace.dependencies ?? []);

  return dependencies;
}

interface Dependency
{
  name: string;
  version: string;
}

void main();
