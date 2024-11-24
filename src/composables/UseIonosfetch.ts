import { Capacitor, CapacitorHttp } from "@capacitor/core";

export const useIFetch = () => {
  const baseurl =  'http://192.168.15.175:5678' // config.public.SERVER_ADDRESS
  
  const get = async (url: string) => {
    const response = await CapacitorHttp.get({
      url: baseurl + url,
    });
    return response.data
  }

  //@ts-ignore 
  const post = async ( url, options ) => {
      options.url = baseurl + url;
      const response = await CapacitorHttp.post( options );
      return response.data
  }

  //@ts-ignore
  const put = async ( url, options ) => {
      options.url = baseurl + url;
      const response = await CapacitorHttp.put( options );
      return response.data
  }

  //@ts-ignore
  const del = async ( url, options ) => {
    options.url = baseurl + url
    const response = await CapacitorHttp.delete( options )
    return response.data
  }

  //@ts-ignore
  const request = async ( url, options ) => {
      options.url = baseurl + url
      const response = await CapacitorHttp.request( options )
      return response.data
  }

  return {
    get,
    post,
    put,
    del,
    request
  };
};
