import aclNames from '@/acl/acl-names';

export default {
  computed: {
    aclName() {
      return aclNames;
    },
  }, methods: {
    aclCan(permission) {
      const currentDatasetId = this.$store.state.dataset?.id;
      return this.$store.state.scopes[currentDatasetId]?.includes(permission);
    },
  },
};
