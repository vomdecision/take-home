from enum import Enum
from typing import List, Tuple, Union

class BlockType(Enum):
    START = "StartBlock",
    CONDITIONAL = "ConditionalBlock"
    END = "EndBlock",

class DecisionBlock:
    def __init__(self, block_id: str, block_type: BlockType):
        self.id = block_id
        self.type = block_type

class StartBlock(DecisionBlock):
    def __init__(
            self,
            block_id: str,
            next_block: str
            ):
        super().__init__(block_id, BlockType.START)
        self.next_block = next_block

class ConditionalBlock(DecisionBlock):
    def __init__(
            self,
            block_id:str,
            variable: str,
            operator: str,
            value: float,
            true_branch: str,
            false_branch: str,
            ):
        super().__init__(block_id, BlockType.CONDITIONAL)
        self.variable = variable
        self.operator = operator
        self.true_branch = true_branch
        self.false_branch = false_branch

class EndBLock(DecisionBlock):
    def __init__(self, block_id:str, decision_value: float ):
        super().__init__(block_id, BlockType.END)
        self.decision_value = decision_value

class Policy:
    def __init__(
            self,
            name: str,
            blocks: List[DecisionBlock],
            variables: List[Tuple[str, str]]
            ):
        self.id = id(self)  # Unique identifier based on memory location
        self.name = name
        self.blocks = blocks
        self.variables = variables

def get_variable_value(self, variable_name: str) -> Union[str, float]:
        """Retrieve and attempt to parse the variable value."""
        for var, value in self.variables:
            if var == variable_name:
                try:
                    return float(value) if "." in value or value.isdigit() else int(value)
                except ValueError:
                    return value  # Return as str if it can't be converted
        raise ValueError(f"Variable {variable_name} not found")
