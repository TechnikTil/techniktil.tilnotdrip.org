import { Fragment, type JSX, useEffect, useState } from "react";
import production from "react/jsx-runtime";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import { unified } from "unified";
import type { VFile } from "vfile";
import { matter } from "vfile-matter";

export default function Projects(): JSX.Element
{
	const [projectList, setProjectList] = useState<string[] | undefined>(undefined);
	const [loadedProjects, setLoadedProjects] = useState<Record<string, JSX.Element>>({});

	useEffect(() =>
	{
		if (projectList) return;

		fetch("/data/projects/list.txt").then(res => res.text()).then(text => setProjectList(text.trim().split("\n")));
	}, [projectList]);

	useEffect(() =>
	{
		if (!projectList) return;

		projectList?.forEach(async (value: string, _: number, __: string[]) =>
		{
			if (loadedProjects[value]) return;

			const mdResponse: Response = await fetch(`/data/projects/${value}.md`);

			const processor: any = unified();
			processor.use(remarkParse);
			processor.use(remarkFrontmatter);
			processor.use(() => (_: any, file: any) => matter(file));
			processor.use(remarkRehype, {allowDangerousHtml: true});
			processor.use(rehypeRaw);
			processor.use(rehypeSanitize, {...defaultSchema, attributes: {"*": ["style"]}});
			processor.use(rehypeReact, production);

			const file: VFile = await processor.process(await mdResponse.text());
			const dataMatter: any = file.data.matter;
			const downloads: any[] = dataMatter.downloads;

			const downloadNodes: JSX.Element[] = downloads.map((value: any, index: number, array: any[]) =>
			{
				return (
					<Fragment key={`url${index}`}>
						[<a href={value.url} className="yellow">{value.name}</a>]
						{index < array.length - 1 && " "}
					</Fragment>
				);
			});

			const node: JSX.Element = (
				<div key={value} className="project">
					<img src={`images/projects/${dataMatter.image}`} style={{width: "555px", height: "auto"}} />
					<div style={{marginTop: "5px", fontSize: "25px"}}>{dataMatter.name}</div>
					<div style={{marginTop: "5px", fontSize: "18px"}}>{file.result as JSX.Element}</div>
					<div className="centered" style={{marginTop: "15px", fontSize: "20px"}}>{downloadNodes}</div>
				</div>
			);

			setLoadedProjects(prev => ({...prev, [value]: node}));
		});
	});

	return <div id="projects">{projectList?.map(name => loadedProjects[name])}</div>;
}
