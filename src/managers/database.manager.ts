import { Game } from "../game";
import { Manager } from "./manager";

export class DatabaseManager extends Manager {
  readonly overgardensDb = "overgardens";
  readonly gamesStore = "games";
  idxdb: IDBFactory;
  db: IDBDatabase | undefined;

  constructor(game: Game) {
    super(game);
    this.idxdb = window.indexedDB;
    this.openDb();
  }

  openDb() {
    let req = this.idxdb.open(this.overgardensDb);
    req.onerror = (err) => console.error(`idb error: ${req.error}`, err);
    req.onsuccess = () => (this.db = req.result);
    req.onupgradeneeded = () => {
      this.db = req.result;
      this.db.createObjectStore(this.gamesStore, { keyPath: "gameId" });
    };
  }

  getStore(name: string, mode: IDBTransactionMode) {
    console.log(this.db);
    if (this.db) {
      let tx = this.db.transaction(name, mode);
      return tx.objectStore(name);
    }
  }

  saveGame() {
    let store = this.getStore(this.gamesStore, "readwrite");
    if (store) {
      let req = store.put(this.game.createSaveData());
      req.onsuccess = () => console.log("save success");
      req.onerror = (err) => console.error(`save error: ${req.error}`, err);
    }
  }

  loadGame(key: string) {
    let store = this.getStore(this.gamesStore, "readonly");
    if (store) {
      let req = store.get(key);
      req.onsuccess = () => {
        this.game.loadSaveData(req.result);
        console.log("load success");
      };
      req.onerror = (err) => console.error(`load error: ${req.error}`, err);
    }
  }
}
