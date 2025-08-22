import aclRoleNames from '@/acl/acl-role-names';
import editor from '@/acl/roles/editor';
import owner from '@/acl/roles/owner';
import reader from '@/acl/roles/reader';

export default {
  [aclRoleNames.READER]: reader,
  [aclRoleNames.EDITOR]: editor,
  [aclRoleNames.OWNER]: owner,
};
