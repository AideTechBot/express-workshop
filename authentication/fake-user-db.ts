export type UserEntry = {
  password: string; // DO NOT DO THIS
  data: string;
  session: any;
};

const _database: Record<string, UserEntry> = {
  manuel: {
    password: 'notmanuel',
    data: 'some data',
  } as UserEntry,
  daniel: {
    password: 'notdaniel',
    data: 'some different data',
  } as UserEntry,
};

export const getUserEntryById = (id: string) => _database?.[id] ?? null;

export const setUserDataById = (id: string, session: any, value: string) => {
  if (_database?.[id]) {
    _database[id].data = value;
    _database[id].session = session;
    return true;
  }
  return false;
};
