import os

def print_directory_tree(path, padding, print_files=False, file_output=None):
    if file_output:
        file_output.write(padding[:-1] + '+--' + os.path.basename(path) + '\n')
    else:
        print(padding[:-1] + '+--' + os.path.basename(path))
    padding = padding + '   '
    files = []
    if print_files:
        files = [os.path.join(path, f) for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
    directories = [os.path.join(path, f) for f in os.listdir(path) if os.path.isdir(os.path.join(path, f))]
    for directory in directories:
        print_directory_tree(directory, padding, print_files, file_output)
    if print_files:
        for file in files:
            if file_output:
                file_output.write(padding + '+--' + os.path.basename(file) + '\n')
            else:
                print(padding + '+--' + os.path.basename(file))

output_file = "directory_tree.txt"
with open(output_file, 'w') as f:
    print_directory_tree('.', '', True, f)
print(f"Directory tree saved to {output_file}")
