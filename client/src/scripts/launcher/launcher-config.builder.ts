class LaunchConfigBuilder {
  private args: string[] = [];
  // треба доробити ще з технічними аргументами стартапу, які ми вписали б як константу, або в конструкторі

  setUsername(name: string): this {
    this.args.push('--username', name);
    return this;
  };

  setVersion(version: string): this {
    this.args.push('--version', version);
    return this;
  };

  setMemory(xmx: string): this {
    this.args.unshift(`-Xmx${xmx}`);
    return this;
  };

  build(): string[] {
    return this.args;
  };
};

export default LaunchConfigBuilder;
