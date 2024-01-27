from deta import Deta

KEY = "d0fWjbsJoY9A_adLntWPmGz3WteSPEjnYFQomYU5pS2KA"
deta = Deta(KEY)

old_deta  = Deta("d0kg7bwgnhq_VthnaaCg4ZM1vXS1RYMX6ML4dNcQyzoN")

for bsnm in ["data","others"]:
    lst=[]
    last=None
    while True:
        dt=old_deta.Base(bsnm).fetch(last)
        lst.extend(dt.items)
        if not dt.last:
            break
        last=dt.last
    deta.Base(bsnm).put_many(lst)