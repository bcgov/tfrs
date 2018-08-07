import abc


class OperationalDataScript:

    def __init__(self, name, args):
        self.name = name
        self.args = args


    # These should be set in subclasses
    is_revertable = False
    comment = None

    @abc.abstractmethod
    def check_run_preconditions(self):
        pass

    @abc.abstractmethod
    def run(self, *args):
        pass

    def check_revert_preconditions(self):
        raise NotImplementedError()

    def revert(self, *args):
        raise NotImplementedError()
