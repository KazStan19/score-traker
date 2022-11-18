import { Player } from './player.modle';

export interface Game {
  id: number;
  name: string;
  players: Player[] | [];
}
