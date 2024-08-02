#include <bits/stdc++.h>
using namespace std;
void isPrime(int n) {
    // Your code here
    for(int i=2; i<n; i++){
        if(n%i==0){
            cout<<"false"<<endl;
            return
        }
    }
    cout<<"true"<<endl;


    // print the output
}

//do not dare to touch the main function
int main(){

isPrime(2);
isPrime(4);
isPrime(17);
isPrime(20);
isPrime(19);}