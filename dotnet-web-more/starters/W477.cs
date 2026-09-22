// W477: Sparse fieldset projection / Default fields title and stock
namespace DotnetWeb;
public static class W477{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W477");}
}
