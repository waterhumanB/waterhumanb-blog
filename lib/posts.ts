import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// path.join("안에","값들로 경로를 받는다.") , process.cwd() 메소드는 node.js 프로세스의 현재 작업 디렉터리를 지정하여 문자열로 반환 합니다.
// const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData(postsDirectory: string) {
  // /posts에서 파일 이름 가져오기
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    // 파일 이름에서 ".md"를 제거하여 slug를 가져옵니다.
    const slug = fileName.replace(/\.md$/, "");

    // 마크다운 파일을 문자열로 읽습니다.
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // gray-matter을 사용하여 게시물 메타데이터 섹션을 구문 분석합니다.
    const matterResult = matter(fileContents);

    // 데이터를 slug와 결합
    return {
      slug,
      ...matterResult.data,
    };
  });
  // 날짜별로 게시물 정렬
  return allPostsData.sort(({ date: a }: any, { date: b }: any) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getAllPostSlugs(postsDirectory: string) {
  const fileNames = fs.readdirSync(postsDirectory);

  // 다음과 같은 배열을 반환합니다.
  // [
  //   {
  //     params: {
  //       slug: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       slug: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map(fileName => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(postsDirectory: string, slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gary-matter을 사용하여 게시물 메타데이터 섹션 구문 분석
  const matterResult = matter(fileContents);

  // remark를 사용하여 마크다운을 HTML 문자열로 변환
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // 데이터를 slug 및 contentHtml과 결합
  return {
    slug,
    contentHtml,
    ...matterResult.data,
  };
}
