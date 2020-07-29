from abc import ABC, abstractmethod


class Consensus(ABC):

    def __init__(self, block):
        self.block = block
        super().__init__()

    @abstractmethod
    def mine_block(self):
        pass


class ProofOfWork(Consensus):

    def __init__(self, block, difficulty):
        self.difficulty = difficulty
        super().__init__(block)

    def mine_block(self):
        compare_str = "".join((["0"] * self.difficulty))
        while self.block.currentHash[0:self.difficulty] != compare_str:
            self.block.nonce += 1
            self.block.currentHash = self.block.calculate_hash()