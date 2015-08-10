import ast
# solution inspired by
# http://stackoverflow.com/questions/2371436/evaluating-a-mathematical-expression-in-a-string


class Visitor(ast.NodeVisitor):
    def visit(self, node):
        if not isinstance(node, self.whitelist):
            import pdb; pdb.set_trace()
            raise ValueError(node)
        return super(Visitor, self).visit(node)

    whitelist = (
        ast.Module, ast.Expr, ast.Load, ast.Expression, ast.Add,
        ast.Sub, ast.UnaryOp, ast.Num, ast.BinOp,
        ast.Mult, ast.Div, ast.Pow, ast.BitOr, ast.BitAnd,
        ast.BitXor, ast.USub, ast.UAdd, ast.FloorDiv, ast.Mod,
        ast.LShift, ast.RShift, ast.Invert
    )


def evaluate(expr):
    try:
        node = ast.parse(expr.strip(), mode='eval')
        Visitor().visit(node)
        return eval(compile(node, "", "eval"))
    except:
        raise ValueError(expr)
