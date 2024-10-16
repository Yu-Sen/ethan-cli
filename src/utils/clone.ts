/*
 * @Author: 黄昱森
 * @LastEditors: 黄昱森
 * @Description:
 */
import simpleGit, { SimpleGitOptions } from "simple-git";
import createLogger from "progress-estimator";
import chalk from "chalk";
import { log } from "./log";

const logger = createLogger({
  spinner: {
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
      chalk.green(item)
    ),
    interval: 300,
  },
});

const gitOption: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: "git",
  maxConcurrentProcesses: 6,
};

export const clone = async (
  url: string,
  projectName: string,
  options?: string[]
) => {
  const git = simpleGit(gitOption);
  try {
    await logger(git.clone(url, projectName, options), "正在下载模版...", {
      estimate: 8000, // 展示预估时间
    });

    log.success(`${chalk.blueBright(projectName)} 创建成功`);
    log.success(`执行以下命令启动项目：`);
    log.info(`cd ${chalk.blueBright(projectName)}`);
    log.info(`${chalk.yellow("pnpm")} install`);
    log.info(`${chalk.yellow("pnpm")} run dev`);
  } catch (e) {
    log.error("下载失败");
    log.error(String(e));
  }
};
