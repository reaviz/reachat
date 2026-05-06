import { findAndReplace } from 'mdast-util-find-and-replace';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

const CVE_REGEX = /(CVE-(19|20)\d{2}-\d{4,7})/gi;

export const remarkCve: Plugin<[], Root> = () => tree => {
  findAndReplace(tree as never, [
    [
      CVE_REGEX,
      (value: string) => ({
        type: 'link',
        url: `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${value.trim()}`,
        children: [{ type: 'text', value: value.trim() }]
      })
    ]
  ]);
};
