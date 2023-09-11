import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SectionList,
} from 'react-native';
import getItemLayout from 'react-native-section-list-get-item-layout';

const BOOKS = [
  { id: 1, category: "Fiction", title: "The Great Gatsby", author: "F. Scott Fitzgerald", inStock: true },
  { id: 2, category: "Fiction", title: "To Kill a Mockingbird", author: "Harper Lee", inStock: false },
  { id: 3, category: "Non-Fiction", title: "Sapiens:S", author: "Yuval Noah Harari", inStock: true },
  { id: 4, category: "Non-Fiction", title: "Becoming", author: "Michelle Obama", inStock: true },
  { id: 5, category: "Science Fiction", title: "Dune", author: "Frank Herbert", inStock: false },
];

const FilterableBookTable = ({ books }) => {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortedBooks, setSortedBooks] = useState(books);
  const [newBook, setNewBook] = useState({ id: null, category: "", title: "", author: "", inStock: false });

  const filteredBooks = sortedBooks.filter(book => {
    const titleMatches = book.title.toLowerCase().includes(filterText.toLowerCase());
    const inStockMatches = !inStockOnly || book.inStock;
    return titleMatches && inStockMatches;
  });

  const sortBooksAlphabetically = () => {
    const sorted = [...sortedBooks];
    sorted.sort((a, b) => a.title.localeCompare(b.title));
    setSortedBooks(sorted);
  };

  const clearFilters = () => {
    setFilterText('');
    setInStockOnly(false);
    setSortedBooks(books);
  };

  const addBook = () => {
    if (newBook.title && newBook.author && newBook.category) {
      if (newBook.id === null) {
        const generatedId = Math.max(...books.map(book => book.id), 0) + 1;
        setSortedBooks([...sortedBooks, { ...newBook, id: generatedId }]);
      } else {
        const updatedBooks = sortedBooks.map(book => (book.id === newBook.id ? newBook : book));
        setSortedBooks(updatedBooks);
      }
      setNewBook({ id: null, category: "", title: "", author: "", inStock: false });
    }
  };

  const editBook = (book) => {
    setNewBook(book);
  };

  const deleteBook = (id) => {
    const updatedBooks = sortedBooks.filter(book => book.id !== id);
    setSortedBooks(updatedBooks);
  };

  // Define the section data for the SectionList
  const sectionData = [
    {
      title: 'Books',
      data: filteredBooks,
    },
  ];

  // Get the item layout for the SectionList
  const getItemLayoutFunc = getItemLayout({
    getItemHeight: (rowData, sectionIndex, rowIndex) => 60, // Set your item height here
    getSectionHeaderHeight: () => 40, // Set your section header height here
    getSectionFooterHeight: () => 0, // Set your section footer height here
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Books</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          testID="searchInput"
          value={filterText}
          onChangeText={setFilterText}
        />
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={sortBooksAlphabetically}>
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleContainer}>
        <Text>Show Only in Stock</Text>
        <Switch
          testID="inStockSwitch"
          value={inStockOnly}
          onValueChange={setInStockOnly}
        />
      </View>
      <View style={styles.addBookContainer}>
        <TextInput
          style={styles.addBookInput}
          placeholder="Title"
          value={newBook.title}
          onChangeText={text => setNewBook({ ...newBook, title: text })}
        />
        <TextInput
          style={styles.addBookInput}
          placeholder="Author"
          value={newBook.author}
          onChangeText={text => setNewBook({ ...newBook, author: text })}
        />
        <TextInput
          style={styles.addBookInput}
          placeholder="Category"
          value={newBook.category}
          onChangeText={text => setNewBook({ ...newBook, category: text })}
        />
        <View style={styles.inStockToggleContainer}>
          <Text>In Stock</Text>
          <Switch
            value={newBook.inStock}
            onValueChange={value => setNewBook({ ...newBook, inStock: value })}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addBook}>
          <Text style={styles.addButtonText}>{newBook.id ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        style={styles.tableContainer}
      >
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookRow}>
              <View style={styles.cell}>
                <Text>{item.title}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{item.author}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{item.category}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={item.inStock ? styles.inStock : styles.notInStock}>
                  {item.inStock ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.actionsCell}>
                <TouchableOpacity style={styles.editButton} onPress={() => editBook(item)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteBook(item.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.tableHeader}>
              <View style={styles.headerItem}>
                <Text style={styles.headerText}>Title</Text>
              </View>
              <View style={styles.headerItem}>
                <Text style={styles.headerText}>Author</Text>
              </View>
              <View style={styles.headerItem}>
                <Text style={styles.headerText}>Category</Text>
              </View>
              <View style={styles.headerItem}>
                <Text style={styles.headerText}>In Stock</Text>
              </View>
              <View style={styles.headerItem}>
                <Text style={styles.headerText}>Action</Text>
              </View>
            </View>
          )}
          // Use the getItemLayout function for item layout
          getItemLayout={getItemLayoutFunc}
          // Use the stickySectionHeadersEnabled prop for sticky headers
          stickySectionHeadersEnabled={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 8,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  clearButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sortButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 8,
  },
  sortButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addBookContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
  },
  addBookInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 8,
  },
  inStockToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 2,
    maxHeight: 200, // Set a maximum height for the table
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingVertical: 8,
  },
  headerItem: {
    flex: 1, // Equal flex for header and cell
    paddingHorizontal: 16,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 5,
    elevation: 2,
  },
  cell: {
    flex: 1, // Equal flex for header and cell
    paddingHorizontal: 16,
    minWidth: 150, // Set a minimum width for the cells
  },
  actionsCell: {
    flexDirection: 'row', // Change to row to place buttons side by side
    alignItems: 'center',
    justifyContent: 'space-between', // Add space between the buttons
  },
  editButton: {
    backgroundColor: 'blue',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inStock: {
    color: 'green',
    fontWeight: 'bold',
  },
  notInStock: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default function App() {
    return <FilterableBookTable books={BOOKS} />;
  }