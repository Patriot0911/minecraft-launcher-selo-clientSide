
abstract class MinecraftVersion {
  // constructor(public id: string, public type: 'release' | 'snapshot') {}
  constructor(public id: any) {}
  abstract download(): Promise<void>;
};

class SnapshotVersion extends MinecraftVersion {
  async download() {
    // логіка для снапшоту
    // Хз нашо, напевно взагалі треба цю факторі зробити на "ваніла" та "фордж", потім можна буде додавати можливо щось нове, аби міняти логіку старту та завантаження
  };
};

const versionClassMap: Record<any, new (id: any) => MinecraftVersion> = {
  snapshot: SnapshotVersion,
  // release: ReleaseVersion,
};


class VersionFactory {
  static create(meta: any): MinecraftVersion {
    const version = versionClassMap[meta.type];
    // if (meta.type === 'snapshot') return new SnapshotVersion(meta);
    // if (meta.type === 'release') return new ReleaseVersion(meta);
    if(version)
      return new version(meta);
    throw new Error('Unknown version type');
  };
};

export default VersionFactory;
