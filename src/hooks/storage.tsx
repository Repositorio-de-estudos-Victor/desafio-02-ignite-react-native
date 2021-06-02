import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageProviderProps {
  children: ReactNode;
}

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

interface IStorageContextData {
  data: LoginDataProps[];
  searchListData: LoginDataProps[];
  saveData(loginData: LoginDataProps): Promise<void>;
}

const StorageContext = createContext({} as IStorageContextData);

function StorageProvider({ children }: StorageProviderProps){
  const [searchListData, setSearchListData] = useState<LoginDataProps[]>([]);
  const [data, setData] = useState<LoginDataProps[]>([]);

  const passwordStorageKey = '@passmanager:logins';

  async function loadData() {
    try {
      const response = await AsyncStorage.getItem(passwordStorageKey);

      if(response) {
        setSearchListData(JSON.parse(response));
        setData(JSON.parse(response));
      } else {
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveData(loginData: LoginDataProps) {
    try {
      const data = await AsyncStorage.getItem(passwordStorageKey);
      const currentData = data ? JSON.parse(data) : [];
  
      const dataFormatted = [
        ...currentData,
        loginData
      ];
  
      await AsyncStorage.setItem(passwordStorageKey, JSON.stringify(dataFormatted));
    } catch (error) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    loadData();
  }, [])

  return(
    <StorageContext.Provider value={{
      data,
      searchListData,
      saveData
    }}>
      {children}
    </StorageContext.Provider>
  )
}

function useStorage() {
  const context = useContext(StorageContext);

  return context;
}

export { StorageProvider, useStorage }