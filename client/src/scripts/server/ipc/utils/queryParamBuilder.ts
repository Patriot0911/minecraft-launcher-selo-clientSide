type TFilterContent = string | number | boolean | undefined | null;

class QueryParamBuilder {
  static apiVersions = ['page', 'pageSize', 'versionType', 'sortOrder', 'sortColumn',];

  static filters = {
    apiVersions: this.apiVersions,
  };

  static buildFilter(keys: string[], query: Record<string, any>) {
    const res = new URLSearchParams();
    for(const k of keys) {
      if(!query[k])
        continue;
      res.set(k, query[k]);
    };
    return res.toString();
  };

  static getFilter = (filterName: keyof typeof QueryParamBuilder.filters, query: Record<string, TFilterContent>) =>
    QueryParamBuilder.buildFilter(QueryParamBuilder.filters[filterName], query);
};

export default QueryParamBuilder;
