#include <stdio.h>
#include <string.h>
#include <ctype.h>

#define int long long

int is_op(char c) {
    return c == '+' || c == '-' || c == '*' || c == '/' || c == '%';
}

int prec(char c) {
    if (c == '+' || c == '-') return 1;
    if (c == '*' || c == '/' || c == '%') return 2;
    return 0;
}

void postfix_eval(int postfix[], int len) {
    int s[4005], s_cnt = 0;
    for (int i = 0; i < len; i++) {
        if (is_op(postfix[i])) {
            int n2 = s[--s_cnt];
            int n1 = s[--s_cnt];
            int ans;
            if (postfix[i] == '+') ans = n1 + n2;
            else if (postfix[i] == '-') ans = n1 - n2;
            else if (postfix[i] == '*') ans = n1 * n2;
            else if (postfix[i] == '/') ans = n1 / n2;
            else ans = n1 % n2;
            s[s_cnt++] = ans;
        } else {
            s[s_cnt++] = postfix[i];
        }
    }
    printf("value: %lld\n", s[s_cnt - 1]);
}

void infix_to_postfix(const char *infix, int postfix[], int *postfix_len, char *postfix_str) {
    char op_stk[4005];
    int op_top = 0, p = 0, str_p = 0;
    int i = 0;

    while (infix[i]) {
        if (isspace(infix[i])) {
            i++;
            continue;
        }

        if (isdigit(infix[i])) {
            int val = 0;
            while (isdigit(infix[i])) {
                val = val * 10 + (infix[i] - '0');
                postfix_str[str_p++] = infix[i];
                i++;
            }
            postfix[p++] = val;
            postfix_str[str_p++] = ' ';
        } else if (infix[i] == '(') {
            op_stk[op_top++] = infix[i++];
        } else if (infix[i] == ')') {
            while (op_top && op_stk[op_top - 1] != '(') {
                postfix[p++] = op_stk[--op_top];
                postfix_str[str_p++] = postfix[p - 1];
                postfix_str[str_p++] = ' ';
            }
            if (op_top && op_stk[op_top - 1] == '(') op_top--;
            i++;
        } else if (is_op(infix[i])) {
            while (op_top && prec(op_stk[op_top - 1]) >= prec(infix[i])) {
                postfix[p++] = op_stk[--op_top];
                postfix_str[str_p++] = postfix[p - 1];
                postfix_str[str_p++] = ' ';
            }
            op_stk[op_top++] = infix[i++];
        } else {
            i++;
        }
    }

    while (op_top) {
        postfix[p++] = op_stk[--op_top];
        postfix_str[str_p++] = postfix[p - 1];
        postfix_str[str_p++] = ' ';
    }

    postfix_str[str_p] = '\0';
    *postfix_len = p;
}

void infix_to_prefix(const char *infix, char *prefix_str) {
    char rev[4005], temp[4005], res[4005];
    int len = strlen(infix), idx = 0;

    for (int i = len - 1; i >= 0; i--) {
        if (infix[i] == '(') rev[idx++] = ')';
        else if (infix[i] == ')') rev[idx++] = '(';
        else rev[idx++] = infix[i];
    }
    rev[idx] = '\0';

    int dummy[4005], dummy_len;
    infix_to_postfix(rev, dummy, &dummy_len, temp);

    int j = 0, k = strlen(temp) - 1;
    while (k >= 0) {
        if (temp[k] == ' ') {
            prefix_str[j++] = ' ';
        } else {
            prefix_str[j++] = temp[k];
        }
        k--;
    }
    prefix_str[j] = '\0';
}

signed main(void) {
    char infix[4005];
    while (scanf("%s", infix) != EOF) {
        int postfix[4005], postfix_len = 0;
        char postfix_str[4005], prefix_str[4005];

        infix_to_postfix(infix, postfix, &postfix_len, postfix_str);
        infix_to_prefix(infix, prefix_str);

        printf("prefix: %s\n", prefix_str);
        printf("postfix: %s\n", postfix_str);
        postfix_eval(postfix, postfix_len);
    }
    return 0;
}