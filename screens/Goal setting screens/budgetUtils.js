import { doc, getDoc,collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this is the correct path to your firebaseConfig file

// Function to fetch expenses for the current month
export const fetchMonthlyExpenses = async (userEmail) => {
  try {
    const userDocRef = doc(db, 'users', userEmail);
    const expensesCollectionRef = collection(userDocRef, 'expenses');
    const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-based
    const currentYear = new Date().getFullYear();

    const expensesQuery = query(
      expensesCollectionRef,
      where('type', '==', 'Expenditure'),
      where('month', '==', currentMonth),
      where('year', '==', currentYear)
    );

    const querySnapshot = await getDocs(expensesQuery);
    let total = 0;
    querySnapshot.forEach((doc) => {
      total += parseFloat(doc.data().amount);
    });

    return total;
  } catch (error) {
    console.error('Error fetching expenditures: ', error);
    return 0;
  }
};

// Function to fetch the user's income
export const fetchUserIncome = async (userEmail) => {
    try {
        const userDocRef = doc(db, 'users', userEmail);
        const expensesCollectionRef = collection(userDocRef, 'expenses');
        const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-based
        const currentYear = new Date().getFullYear();
    
        const expensesQuery = query(
          expensesCollectionRef,
          where('type', '==', 'Income'),
          where('month', '==', currentMonth),
          where('year', '==', currentYear)
        );
    
        const querySnapshot = await getDocs(expensesQuery);
        let total = 0;
        querySnapshot.forEach((doc) => {
          total += parseFloat(doc.data().amount);
        });
    
        return total;
      } catch (error) {
        console.error('Error fetching income: ', error);
        return 0;
      }
    };

// Function to calculate the spent percentage
export const calculateSpentPercentage = (income, goalAmount, totalExpenditure) => {
  const budget = income - goalAmount;
  if (budget <= 0) return 0;
  return (totalExpenditure / budget) * 100;
};

export const categorySpent = async (category, userEmail) => {
    try {
        const userDocRef = doc(db, 'users', userEmail);
        const expensesCollectionRef = collection(userDocRef, 'expenses');
        const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-based
        const currentYear = new Date().getFullYear();
    
        const expensesQuery = query(
          expensesCollectionRef,
          where('category', '==', category),
          where('type', '==', 'Expenditure'),
          where('month', '==', currentMonth),
          where('year', '==', currentYear)
        );
    
        const querySnapshot = await getDocs(expensesQuery);
        let total = 0;
        querySnapshot.forEach((doc) => {
          total += parseFloat(doc.data().amount);
        });
    
        return total;
      } catch (error) {
        console.error('Error fetching category expenses: ', error);
        return 0;
      }
};
