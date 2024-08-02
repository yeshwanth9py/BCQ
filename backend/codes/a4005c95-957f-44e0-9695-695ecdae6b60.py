def is_prime(n):
    # Your code here
    for i in range(2, n):
        if(n%i==0):
            print("false")
            return
    print("true")

    # print the output

is_prime(2)
is_prime(4)
is_prime(17)
is_prime(20)
is_prime(19)