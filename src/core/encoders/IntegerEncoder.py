class IntegerEncoder:

    def encode(self,num):
        encoding = []
        for i, digit in enumerate(str(num)):
            encoding.append(int(digit) + (i * 10))
        return encoding

    def decode(self,encoding):
        num = ''
        for i, digit in enumerate(encoding):
            num += digit - (i * 10)
        return int(num)