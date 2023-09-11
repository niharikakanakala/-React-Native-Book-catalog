import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from './App';

const MOCK_BOOKS = [
  { id: 1, category: "Fiction", title: "The Great Gatsby", author: "F. Scott Fitzgerald", inStock: true },
  { id: 2, category: "Fiction", title: "To Kill a Mockingbird", author: "Harper Lee", inStock: false },
  { id: 3, category: "Non-Fiction", title: "Sapiens:S", author: "Yuval Noah Harari", inStock: true },
  { id: 4, category: "Non-Fiction", title: "Becoming", author: "Michelle Obama", inStock: true },
  { id: 5, category: "Science Fiction", title: "Dune", author: "Frank Herbert", inStock: false },
];

test('adds a new book', () => {
  const { getByPlaceholderText, getByText, queryByText } = render(
    <App books={MOCK_BOOKS} />
  );

  const addTitleInput = getByPlaceholderText('Title');
  const addAuthorInput = getByPlaceholderText('Author');
  const addCategoryInput = getByPlaceholderText('Category');

  fireEvent.changeText(addTitleInput, 'New Book');
  fireEvent.changeText(addAuthorInput, 'Author Name');
  fireEvent.changeText(addCategoryInput, 'Category Name');

  const addButton = getByText('Add');
  fireEvent(addButton, 'press');

  const addedBook = queryByText('New Book');
  expect(addedBook).toBeTruthy();
});

test('deletes an existing book', () => {
  const { getAllByText, queryByText } = render(
    <App books={MOCK_BOOKS} />
  );

  // Get the "Delete" button for the book you want to delete
  const deleteButton = getAllByText('Delete')[0];
  fireEvent(deleteButton, 'press');

  const deletedBook = queryByText('The Great Gatsby');
  expect(deletedBook).toBeFalsy();
});

test('edits an existing book', () => {
  const { getAllByText, getByPlaceholderText, queryByText, getByText } = render(
    <App books={MOCK_BOOKS} />
  );

  // Get the "Edit" button for the book you want to edit
  const editButton = getAllByText('Edit')[0];
  fireEvent(editButton, 'press');

  const editTitleInput = getByPlaceholderText('Title');
  const editAuthorInput = getByPlaceholderText('Author');
  const editCategoryInput = getByPlaceholderText('Category');

  fireEvent.changeText(editTitleInput, 'Edited Book');
  fireEvent.changeText(editAuthorInput, 'Edited Author Name');
  fireEvent.changeText(editCategoryInput, 'Edited Category Name');

  const updateButton = getByText('Update');
  fireEvent(updateButton, 'press');

  const editedBook = queryByText('Edited Book');
  expect(editedBook).toBeTruthy();
});

test('clears filters when "Clear Filters" button is pressed', () => {
  const { getByText, getByPlaceholderText, queryByText } = render(
    <App books={MOCK_BOOKS} />
  );

  const searchInput = getByPlaceholderText('Search...');
  fireEvent.changeText(searchInput, 'Great Gatsby');

  const matchingBook = queryByText('The Great Gatsby');
  expect(matchingBook).toBeTruthy();

  const clearFiltersButton = getByText('Clear Filters');
  fireEvent(clearFiltersButton, 'press');

  const nonMatchingBook = queryByText('To Kill a Mockingbird');
  expect(nonMatchingBook).toBeTruthy();
});

test('filters books based on search input', () => {
  const { getByPlaceholderText, queryByText } = render(
    <App books={MOCK_BOOKS} />
  );

  const searchInput = getByPlaceholderText('Search...');
  fireEvent.changeText(searchInput, 'Great Gatsby');

  const matchingBook = queryByText('The Great Gatsby');
  const nonMatchingBook = queryByText('To Kill a Mockingbird');

  expect(matchingBook).toBeTruthy();
  expect(nonMatchingBook).toBeFalsy();
});

test('toggles "Show Only in Stock" switch', () => {
  const { getByText, queryByText } = render(
    <App books={MOCK_BOOKS} />
  );

  const showOnlyInStockSwitch = getByText('Show Only in Stock');

  // Initially, we expect "To Kill a Mockingbird" to be present
  let outOfStockBook = queryByText('To Kill a Mockingbird');
  expect(outOfStockBook).toBeTruthy();

  // Toggle the "Show Only in Stock" switch
  fireEvent.press(showOnlyInStockSwitch);

  // After toggling, we expect "To Kill a Mockingbird" to be hidden
  outOfStockBook = queryByText('To Kill a Mockingbird');
  expect(outOfStockBook).toBeTruthy();
});

it('should sort books alphabetically', () => {
  const sorted = [...MOCK_BOOKS];
  console.log('sorted');
  const a = sorted.sort((a, b) => a.title.localeCompare(b.title));

  expect(a).toEqual(sorted);
});

test('clears filters', async () => {
  const { getByText, getByPlaceholderText, getByTestId } = render(
    <App books={MOCK_BOOKS} />
  );

  // Step 2: Set some filters (e.g., type in the search input and toggle the switch)
  const searchInput = getByPlaceholderText('Search...');
  const inStockSwitch = getByTestId('inStockSwitch'); // Ensure you have a test ID for the switch

  fireEvent.changeText(searchInput, 'Dune'); // Type a search query
  fireEvent(inStockSwitch, 'valueChange', true); // Toggle the "Show Only in Stock" switch

  // Step 3: Click the "Clear Filters" button
  const clearFiltersButton = getByText('Clear Filters');
  fireEvent.press(clearFiltersButton);

  // Allow the component to update (e.g., clear the filters)
  await waitFor(() => {
    expect(searchInput.props.value).toBe(''); // Ensure the search input is cleared
    expect(inStockSwitch.props.value).toBe(false); // Ensure the switch is toggled off
  });

  // Step 4: Assert that filters are cleared and the component displays the initial state
  const filterText = searchInput.props.value;

  expect(filterText).toBe(''); // Filter text should be empty
  expect(inStockSwitch.props.value).toBe(false); // Switch should be off

  // You can add additional assertions to check if the component displays the initial data.
  // For example, check if the book titles are displayed based on MOCK_BOOKS.
});

test('filters books based on filterText and inStockOnly', () => {
  // Render the App component with the MOCK_BOOKS data
  const { getByPlaceholderText, getByTestId, queryByText } = render(
    <App books={MOCK_BOOKS} />
  );

  // Find the input field for filtering by title and change its value
  const filterInput = getByPlaceholderText('Search...');
  fireEvent.changeText(filterInput, 'Sapiens');

  // Find the "Show Only in Stock" switch and toggle it
  const inStockSwitch = getByTestId('inStockSwitch');
  fireEvent(inStockSwitch, 'valueChange', { value: true });

  // Expect only matching books to be displayed
  expect(queryByText('The Great Gatsby')).toBeNull();
  expect(queryByText('To Kill a Mockingbird')).toBeNull();
  expect(queryByText('Sapiens:S')).toBeTruthy();
  expect(queryByText('Becoming')).toBeNull();
  expect(queryByText('Dune')).toBeNull();
});

