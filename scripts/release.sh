#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf '%s\n' "$*" >&2
  exit 1
}

if [[ $# -lt 1 || $# -gt 2 ]]; then
  fail '用法 bash scripts/release.sh 1.2.3 [提交说明]'
fi

version=${1#v}
[[ $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || fail '请填写形如 1.2.3 或 v1.2.3 的版本号。'
tag="v$version"
tag_ref="refs/tags/$tag"
branch_ref=refs/heads/main
commit_message=${2:-发布官网 $tag}

cd "$(dirname "$0")/.."
[[ $(git symbolic-ref -q HEAD) == "$branch_ref" ]] || fail '请切换到官网仓库的 main 分支后再发布。'

remote=${RELEASE_REMOTE:-origin}
if [[ -z ${RELEASE_REMOTE:-} ]] && git remote get-url github >/dev/null 2>&1; then
  remote=github
fi
git remote get-url --push -- "$remote" >/dev/null

if [[ -n $(git ls-files --others --exclude-standard) ]]; then
  git ls-files --others --exclude-standard >&2
  fail '请先用 git add 暂存要发布的新文件，或处理无需发布的新文件。'
fi

remote_tag=$(git ls-remote --refs -- "$remote" "$tag_ref")
[[ -z $remote_tag ]] || fail "远程标签 $tag 已存在，请使用新的版本号。"

git fetch --no-tags -- "$remote" "$branch_ref"
git merge-base --is-ancestor FETCH_HEAD HEAD || fail '远程 main 有本地尚未合入的提交，请先同步。'

if git show-ref --verify --quiet "$tag_ref"; then
  local_commit=$(git rev-parse "$tag_ref^{commit}")
  if [[ $local_commit != "$(git rev-parse HEAD)" || -n $(git status --porcelain) ]]; then
    fail "本地标签 $tag 已存在且无法用于重试，请检查标签和未提交的改动。"
  fi
fi

node verify.mjs
git add -u
if ! git diff --cached --quiet; then
  git commit -m "$commit_message"
fi

if ! git show-ref --verify --quiet "$tag_ref"; then
  git tag -a "$tag" -m "官网发布 $tag"
fi

if ! git push --atomic --no-follow-tags -- "$remote" "HEAD:$branch_ref" "$tag_ref:$tag_ref"; then
  fail "推送命令失败，本地保留了提交和标签 ${tag}。请检查远程状态，若标签尚未推送可重跑原命令。"
fi
printf '已推送 main 分支和版本标签 %s。\n' "$tag"
