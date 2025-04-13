# SmartCart App - Project Requirements Document

## 1. Project Overview

### 1.1 Purpose

SmartCart is a mobile application designed to help users manage their shopping lists and compare prices across different malls/stores. The app aims to optimize shopping experiences by tracking price histories and helping users make cost-effective purchasing decisions.

### 1.2 Target Audience

- Regular shoppers
- Budget-conscious consumers
- Price-comparing shoppers
- Families managing household shopping

## 2. Functional Requirements

### 2.1 Shopping List Management

- Create, edit, and delete shopping lists

  > **User Story**: As a shopper, I want to create and manage multiple shopping lists so that I can organize my shopping needs for different purposes.
  >
  > **System Behavior**: The system shall allow users to create new lists, edit existing ones, and delete unwanted lists. Each list should have a unique name and timestamp. The system should confirm before deleting lists.

- Add items with specifications:

  - Item name
  - Quantity
  - Unit of measurement
    > **User Story**: As a user, I want to add detailed item specifications to my list so that I can ensure I purchase exactly what I need.
    >
    > **System Behavior**: The system shall provide input fields for item name, quantity, and unit of measurement. It should validate inputs, prevent duplicate items in the same list, and support auto-completion for previously entered items.

- Mark items as purchased

  > **User Story**: As a shopper, I want to mark items as purchased so that I can track what's left to buy during my shopping trip.
  >
  > **System Behavior**: The system shall provide a checkbox or toggle mechanism to mark items as purchased. Purchased items should be visually distinguished and moved to a "purchased" section while maintaining their order.

- Add prices to purchased items

  > **User Story**: As a budget-conscious shopper, I want to record the prices of items I purchase so that I can track my spending.
  >
  > **System Behavior**: The system shall allow price entry for purchased items, validate numeric input, support different currencies, and automatically calculate list totals.

- Track purchase history

  > **User Story**: As a regular shopper, I want to view my purchase history so that I can analyze my shopping patterns and expenses.
  >
  > **System Behavior**: The system shall maintain a chronological log of all purchases, including date, store, price, and item details. It should provide filtering and sorting options for the history view.

- Support multiple active lists
  > **User Story**: As a household manager, I want to maintain separate lists for different purposes.
  >
  > **System Behavior**: The system shall support concurrent active lists with distinct names, allow switching between lists, and provide a dashboard view of all active lists with their completion status.

### 2.2 Mall/Store Management

- Add and manage mall/store profiles

  > **User Story**: As a shopper, I want to create and manage store profiles so that I can keep track of different shopping locations.
  >
  > **System Behavior**: The system shall store detailed information about each mall/store including name, address, operating hours, and contact information. It should prevent duplicate store entries and validate required fields.

- Mark stores as favorites

  > **User Story**: As a frequent shopper, I want to mark my preferred stores as favorites so that I can quickly access them.
  >
  > **System Behavior**: The system shall provide a mechanism to mark stores as favorites and display them prominently in the store list.

- Track last visited dates

  > **User Story**: As a shopper, I want to see when I last visited a store so that I can plan my shopping trips better.
  >
  > **System Behavior**: The system shall automatically log the last visited date for each store and display it in the store profile.

- Store location information

  > **User Story**: As a user, I want to save store locations so that I can easily find and navigate to them.
  >
  > **System Behavior**: The system shall allow users to save and view store locations on a map, including navigation options.

- View price history per store
  > **User Story**: As a price-conscious shopper, I want to view price histories for each store so that I can identify the best places to shop.
  >
  > **System Behavior**: The system shall maintain and display a price history log for each store, including filtering and comparison options.

### 2.3 Price Comparison

- Compare prices of items across different malls

  > **User Story**: As a budget-conscious consumer, I want to compare prices across different stores so that I can find the best deals.
  >
  > **System Behavior**: The system shall provide a comparison tool to display item prices across multiple stores, highlighting the lowest price.

- View price history trends

  > **User Story**: As a smart shopper, I want to see price trends over time so that I can make informed decisions about when to buy.
  >
  > **System Behavior**: The system shall generate and display graphical representations of price trends for selected items.

- Calculate potential savings

  > **User Story**: As a budget-conscious shopper, I want to see potential savings when comparing stores so that I can maximize my budget.
  >
  > **System Behavior**: The system shall calculate and display potential savings for selected items based on price comparisons.

- Track best deals per item
  > **User Story**: As a savvy shopper, I want to track the best deals for items so that I can buy them at the optimal price.
  >
  > **System Behavior**: The system shall maintain a record of the best deals for each item and notify users when a better deal is available.

### 2.4 User Profile

- Basic user information

  > **User Story**: As a user, I want to maintain my profile information so that I can personalize my shopping experience.
  >
  > **System Behavior**: The system shall allow users to input and update their profile information, including name, email, and preferences.

- Preferred stores

  > **User Story**: As a regular shopper, I want to set my preferred stores so that I can quickly access relevant information.
  >
  > **System Behavior**: The system shall allow users to mark stores as preferred and display them prominently in the user profile.

- Shopping history

  > **User Story**: As a user, I want to access my shopping history so that I can track my purchasing patterns.
  >
  > **System Behavior**: The system shall provide a detailed view of the user's shopping history, including filtering and sorting options.

- Customizable settings:
  - Notifications
  - Location preferences
  - Language settings
    > **User Story**: As a user, I want to customize my app settings so that the app works according to my preferences and needs.
    >
    > **System Behavior**: The system shall provide a settings menu where users can configure notifications, location preferences, and language options.

## 3. Technical Requirements

### 3.1 Platform

- Built with React Native/Expo
- Support for iOS and Android devices
- Offline functionality
- Dark/Light theme support

### 3.2 Data Management

- Local storage using AsyncStorage
- Context API for state management
- Data persistence across sessions
- Regular data syncing

### 3.3 UI/UX Requirements

- Responsive design
- Intuitive navigation
- Bottom tab navigation
- Support for both portrait and landscape modes
- Accessibility features
- Loading states and error handling

## 4. Non-Functional Requirements

### 4.1 Performance

- Fast app loading time
- Smooth transitions and animations
- Efficient data loading and caching
- Minimal battery consumption

### 4.2 Security

- Secure data storage
- Privacy protection
- Safe handling of user data

### 4.3 Reliability

- Crash recovery
- Data backup
- Error handling and reporting

## 5. Dependencies

Required Libraries:

- @expo/vector-icons: ^14.0.2
- @react-native-async-storage/async-storage: 1.23.1
- expo-router: ~4.0.17
- react-native-safe-area-context: 4.12.0
- expo-blur: ~14.0.3

## 6. Future Enhancements

### 6.1 Planned Features

- Barcode scanning for products
- Social sharing of shopping lists
- Integration with store loyalty programs
- Smart shopping recommendations
- Receipt scanning and management
- Budget tracking and analytics

## 7. Project Timeline

### 7.1 Development Phases

1. Phase 1: Core Features

   - Shopping list management
   - Basic store management
   - User interface implementation

2. Phase 2: Enhanced Features

   - Price comparison
   - History tracking
   - Data persistence

3. Phase 3: Polish & Optimization
   - Performance optimization
   - UI/UX improvements
   - Testing and bug fixes

## 8. Testing Requirements

### 8.1 Testing Scope

- Unit testing for core functionality
- Integration testing
- User acceptance testing
- Performance testing
- Cross-platform compatibility testing

## 9. Documentation

### 9.1 Required Documentation

- User manual
- API documentation
- Code documentation
- Setup and deployment guides
- Troubleshooting guide

## 10. Maintenance

### 10.1 Post-Launch Support

- Bug fixes and updates
- Feature enhancements
- Performance monitoring
- User feedback implementation
- Regular security updates
