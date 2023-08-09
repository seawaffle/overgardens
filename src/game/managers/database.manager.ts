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
    const req = this.idxdb.open(this.overgardensDb);
    req.onerror = (err) => console.error(`idb error: ${req.error}`, err);
    req.onsuccess = () => {
      this.db = req.result;
    };
    req.onupgradeneeded = () => {
      this.db = req.result;
      this.db.createObjectStore(this.gamesStore, { autoIncrement: false });
    };
  }

  getStore(name: string, mode: IDBTransactionMode) {
    if (this.db) {
      const tx = this.db.transaction(name, mode);
      return tx.objectStore(name);
    }
  }

  saveGame() {
    const store = this.getStore(this.gamesStore, "readwrite");
    if (store) {
      const req = store.put(this.game.createSaveData(), "current");
      req.onsuccess = () => {
        console.log("save success");
      };
      req.onerror = (err) => console.error(`save error: ${req.error}`, err);
    }
  }

  loadGame() {
    const store = this.getStore(this.gamesStore, "readonly");
    if (store) {
      const req = store.get("current");
      req.onsuccess = () => {
        this.game.loadSaveData(req.result);
        console.log("load success");
      };
      req.onerror = (err) => console.error(`load error: ${req.error}`, err);
    }
  }
}
