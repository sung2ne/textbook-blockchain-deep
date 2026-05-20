import hashlib

def demo_hash():
    msg1 = "Hello World"
    msg2 = "Hello World!"
    
    h1 = hashlib.sha256(msg1.encode()).hexdigest()
    h2 = hashlib.sha256(msg2.encode()).hexdigest()
    
    print(f"입력 1: {msg1}")
    print(f"해시 1: {h1}")
    print()
    print(f"입력 2: {msg2}")
    print(f"해시 2: {h2}")
    print()
    print(f"같은가: {h1 == h2}")

demo_hash()
