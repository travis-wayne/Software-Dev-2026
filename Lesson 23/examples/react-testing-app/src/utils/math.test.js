import { describe, it, expect } from 'vitest';
import { add, multiply } from './math';

describe('Math utilities', () => {
  it('should correctly add two numbers', () => {
    // 1. Arrange
    const num1 = 5;
    const num2 = 10;
    
    // 2. Act
    const result = add(num1, num2);
    
    // 3. Assert
    expect(result).toBe(15);
  });

  // Students will complete this test in Exercise 1
  it('should multiply two numbers correctly', () => {
    // Arrange

    // Act

    // Assert
    
  });
});
