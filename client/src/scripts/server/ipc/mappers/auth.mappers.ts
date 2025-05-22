// хз чи треба, чисто вже аби було
const AuthMapper = {
  loginMapper: (data: any) => { // додати типізацію у відповідності
    return {
      ...data,
    };
  },
};

export default AuthMapper;
