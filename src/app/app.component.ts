import { Component, HostListener } from '@angular/core';
import { History, HistoryService } from './history/history.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value: string = '0';
  expression: string = '';
  isEvaluated: boolean = true;
  operand1: string = '';
  operator: string = '';
  isValueChanged: boolean = false;
  unaryOperators: string[] = ['1/x', 'x^2', 'negate', 'sqrt'];
  operators: string[] = ['1/x', 'x^2', 'negate', 'sqrt', '+', '-', '*', '/', '%', 'x'];
  unaryExp: string = '';
  showHistory: boolean = false;

  constructor(private historyService: HistoryService) {}

  // listening to keyboard events
  @HostListener('window:keydown', ['$event'])
  KeyEvent(event: KeyboardEvent) {
    let key = event.key;
    if ('0' <= key && key <= '9') {
      this.appendValue(key);
    } else if (key === '=' || key === 'Enter') {
      this.evaluate();
    } else if (key === 'Backspace') {
      this.onBackspace();
    } else if (key === 'c') {
      this.clearAll();
    } else if (this.operators.indexOf(key) !== -1) {
      if (key === '*') {
        key = 'x';
      }
      this.onOperate(key);
    } else if (key === 'h') {
      this.showHistory = !this.showHistory;
    }
  }

  appendValue(val: string) {
    if (this.isEvaluated) {
      this.resetValues();
    } 
    if (this.operator !== '' && !this.isValueChanged) {
      this.value = '0';
    }
    if (val === '.') {
      if (this.value.indexOf('.') === -1) {
        this.value += '.';
      }
    } else if (this.value === '0') {
      this.value = val;
    } else {
      this.value += val;
    }
    this.isValueChanged = true;
  }

  onBackspace() {
    if (this.isEvaluated) {
      this.value = '0';
      this.expression = '';
    }
    this.value = this.value.substring(0, this.value.length - 1);
    if (this.value === '') {
      this.value = '0';
    }
  }

  resetValues() {
    this.isEvaluated = false;
    this.expression = '';
    this.value = '0';
  }

  evaluate() {
    if (!this.isValueChanged) return;
    this.isEvaluated = true;
    if (this.operator !== '') {
      if (this.unaryExp === '') {
        this.expression = this.expression + this.value + ' = ';
      } else {
        this.expression = this.expression + ' = ';
      }
      this.value = this.evaluateBinaryExp(this.operand1, this.operator, this.value).toString();
      this.historyService.addHistory({
        expression: this.expression,
        result: this.value
      })
      this.operator = '';
      this.operand1 = this.value;
    } else if (this.unaryExp !== '') {
      this.expression = this.unaryExp + ' = ';
      this.historyService.addHistory({
        expression: this.expression,
        result: this.value
      })
    }
  }

  evaluateBinaryExp(op1: string, operator: string, op2: string) {
    switch(operator) {
      case '+': {
        return parseFloat(op1) + parseFloat(op2);
      }
      case '-': {
        return parseFloat(op1) - parseFloat(op2);
      }
      case 'x': {
        return parseFloat(op1) * parseFloat(op2);
      }
      case '/': {
        return parseFloat(op1) / parseFloat(op2);
      }
      case '%': {
        return parseFloat(op1) * parseFloat(op2) / 100;
      }
    }
    return 0;
  }

  evaluateUnaryExp(operand: string, operator: string) {
    let unaryExp = '';
    let currVal = 0;
    if (this.isEvaluated) {
      this.expression = '';
    }
    this.expression = this.expression.replace(this.unaryExp, '');
    let operandExp = operand;
    if (this.unaryExp !== '') {
      operandExp = this.unaryExp;
    }

    switch(operator) {
      case 'negate': {
        currVal = -parseFloat(operand);
        unaryExp = 'negate(' + operandExp + ')';
        break;
      }
      case 'sqrt': {
        currVal = Math.sqrt(parseFloat(operand));
        unaryExp = '√(' + operandExp + ')';
        break;
      }
      case 'x^2': {
        currVal = parseFloat(operand) * parseFloat(operand);
        unaryExp = 'sqr(' + operandExp + ')';
        break;
      }
      case '1/x': {
        currVal = 1 / parseFloat(operand);
        unaryExp = '1/(' + operandExp + ')';
        break;
      }
    }

    this.unaryExp = unaryExp;
    this.expression = this.expression + unaryExp;
    return currVal;
  }

  handleUnaryOperation(operator: string) {
    const unaryVal = this.evaluateUnaryExp(this.value, operator).toString();
    this.value = unaryVal;
  }

  handleBinaryOperation(operator: string) {
    let prevOperand = this.operand1;
    let operandExp;
    if (this.unaryExp !== '') {
      operandExp = this.unaryExp;
    } else {
      operandExp = this.value;
    }
    this.unaryExp = '';
    if (this.operator !== '') {
      this.operand1 = this.evaluateBinaryExp(this.operand1, this.operator, this.value).toString();
      operandExp = this.operand1;
    } else {
      this.operand1 = this.value;
    }

    this.expression = operandExp + ' ' + operator + ' ';

    if (prevOperand !== '') {
      this.historyService.addHistory({
        expression: prevOperand + ' ' + this.operator + ' ' + this.value + ' = ',
        result: this.operand1
      })
    }
    this.value = this.operand1;
  }

  onOperate(operator: string) {
    const isUnaryOperator = this.unaryOperators.indexOf(operator) !== -1;
    if (!this.isValueChanged && !isUnaryOperator) {
      this.operator = operator;
      this.expression = this.operand1 + ' ' + operator + ' ';
      return;
    } 

    if (isUnaryOperator) {
      this.handleUnaryOperation(operator);
    } else {
      this.handleBinaryOperation(operator);
      this.operator = operator;
      this.isValueChanged = false;
    }

    this.isEvaluated = false;
  }

  clearValue() {
    this.value = '0';
    if (this.isEvaluated) {
      this.expression = '';
      this.unaryExp = '';
    }
  }

  clearAll() {
    this.value = '0';
    this.operand1 = '';
    this.operator = '';
    this.expression = '';
    this.isEvaluated = false;
    this.unaryExp = '';
  }

  onSetHistory(history: History) {
    this.expression = history.expression;
    this.value = history.result;
    this.isEvaluated = false;
    this.operand1 = history.result;
    this.isValueChanged = false;
    this.showHistory = false; 
  }
}
