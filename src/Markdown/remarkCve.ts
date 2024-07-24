import { findAndReplace } from 'mdast-util-find-and-replace';

const CVE_REGEX = /(CVE-(19|20)\d{2}-\d{4,7})/gi;

export function remarkCve() {
  return (tree, _file) => {
    findAndReplace(tree, [[
      CVE_REGEX,
      replaceCve as unknown as any
    ]]);
  };

  function replaceCve(value, id) {
    return [
      {
        type: 'link',
        url: `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${id}`,
        children: [
          { children: [{ type: 'text', value: value.trim() }] }
        ]
      }
    ];
  }
}
