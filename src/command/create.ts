/*
 * @Author: 黄昱森
 * @LastEditors: 黄昱森
 * @Description:
 */
import path from "path";
import fs from "fs-extra";
import { select, input } from "@inquirer/prompts";
import { clone } from "../utils/clone";
import { name, version } from "../../package.json";
import { gt } from "lodash";
import log from "../utils/log";
import axios, { AxiosResponse } from "axios";

// 模板信息接口
export interface ITemplate {
  name: string;
  downloadUrl: string;
  branch: string;
  description?: string;
}
// 模版列表
export const templateList: Map<string, ITemplate> = new Map([
  [
    "vue-admin-template",
    {
      name: "vue-admin-template",
      downloadUrl: "https://github.com/Yu-Sen/admin-pro.git",
      branch: "master",
      description: "vue中后台管理系统模板",
    },
  ],
  [
    "react-admin-template",
    {
      name: "react-admin-template",
      downloadUrl: "https://github.com/Yu-Sen/admin-pro.git",
      branch: "master",
      description: "react中后台管理系统模板",
    },
  ],
]);

export async function isOverwrite(dirName: string) {
  return select({
    message: "项目已存在，是否覆盖？",
    choices: [
      { name: "覆盖", value: true },
      { name: "不覆盖", value: false },
    ],
  });
}
export async function getNpmInfo(name: string) {
  try {
    return await axios.get(`https://registry.npmjs.org/${name}`);
  } catch (e) {
    log.error(`获取npm包信息失败，请检查网络或包名是否正确`);
  }
}

export async function getNpmLatestVersion(name: string) {
  const { data } = (await getNpmInfo(name)) as AxiosResponse;
  return data["dist-tags"].latest;
}

export async function checkVersion(name: string, version: string) {
  const latestVersion = await getNpmLatestVersion(name);
  const needUpdate = gt(latestVersion, version);
  if (needUpdate) {
    log.info(`检测到新版本${latestVersion}，当前版本${version}`);
  }
}

export async function create(dirName?: string) {
  await checkVersion(name, version);
  // 如果未输入项目名称，则要求输入项目名称
  if (!dirName) {
    dirName = await input({ message: "请输入项目名称" });
  }
  // 如果项目名称已存在，则提示用户是否覆盖
  const projectPath = path.resolve(process.cwd(), dirName);
  if (fs.existsSync(projectPath)) {
    const run = await isOverwrite(dirName);
    if (run) {
      await fs.removeSync(projectPath);
    } else {
      return;
    }
  }
  // 将模版列表转换为inquirer可接受的格式
  const templates = [...templateList.entries()].map(
    (item: [string, ITemplate]) => {
      const [name, info] = item;
      return {
        name: name,
        value: info.name,
        description: info.description,
      };
    }
  );
  // 选择模版
  const template = await select({
    message: "请选择模板",
    choices: templates,
  });
  // 下载模版
  const gitRepoInfo = templateList.get(template);
  if (gitRepoInfo) {
    clone(gitRepoInfo.downloadUrl, dirName, ["-b", gitRepoInfo.branch]);
  }
}
