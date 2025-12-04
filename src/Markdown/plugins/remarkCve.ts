import type { Link, Root, Text } from 'mdast';
import { findAndReplace } from 'mdast-util-find-and-replace';
import type { Plugin } from 'unified';

const CVE_REGEX = /(CVE-(19|20)\d{2}-\d{4,7})/gi;

export const remarkCve: Plugin<[], Root> = () => {
  return (tree: Root) => {
    findAndReplace(tree, [[CVE_REGEX, replaceCve]], {
      ignore: ['link', 'linkReference']
    });
  };
};

function replaceCve(value: string): Link {
  return {
    type: 'link',
    url: `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${value}`,
    children: [{ type: 'text', value: value.trim() } as Text]
  };
}
