using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemExplorer
{
    /// <summary>
    /// Interaction logic for NodeControl.xaml
    /// </summary>
    public partial class NodeControl : UserControl
    {
        private DependencyPropertyDescriptor renderTransform = DependencyPropertyDescriptor.FromProperty(
            RenderTransformProperty,
            typeof(UserControl));

        private bool isInDrag = false;

        private Point currentPoint;
        private Point anchorPoint;

        public TranslateTransform transform { get; } = new TranslateTransform();

        public event EventHandler OnPositionChanged;

        private static NodeControl CurrentFocused;

        private bool _isFocused;
        public bool IsFocused
        {
            get { return _isFocused; }
            private set
            {
                _isFocused = value;
                if (_isFocused)
                {
                    mainBorder.BorderBrush = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
                    Dispatcher.Invoke((Action)(() =>
                    {

                        {
                            FrameworkElement frameworkElement = Mouse.DirectlyOver as FrameworkElement;
                            Type directlyOverType = frameworkElement?.GetType();
                            if (directlyOverType == null || (directlyOverType.Name != "TextBoxView" &&
                                                             directlyOverType != typeof(Slider) &&
                                                             directlyOverType != typeof(Button) &&
                                                             directlyOverType != typeof(CheckBox) &&
                                                             directlyOverType != typeof(ComboBox) &&
                                                             directlyOverType != typeof(Slider) &&
                                                             directlyOverType != typeof(ScrollViewer) &&
                                                             directlyOverType != typeof(ScrollBar) &&
                                                             directlyOverType != typeof(TextBox) &&
                                                             directlyOverType != typeof(Border)))
                            {

                            }
                        }

                        //Перемещаем текущий object вниз списка, тем самым делая его главнее.
                        if (Parent is Panel panel)
                        {
                            //    Unloaded -= UserControl_Unloaded;
                            panel.Children.Remove(this);
                            panel.Children.Add(this);
                            //   Unloaded += UserControl_Unloaded;
                        }
                    }
                    ));
                }
                else
                {
                    mainBorder.BorderBrush = (SolidColorBrush)App.Current.Resources["OWLOSDefault"];

                    Dispatcher.Invoke((Action)(() =>
                    {
                        //  if ((treeViewItem != null) && treeViewItem.IsSelected)
                        //  {
                        //      treeViewItem.IsSelected = false;
                        //  }
                    }
                    ));

                }

                if (CurrentFocused != null
                    && CurrentFocused != this
                    && CurrentFocused.IsFocused
                    && IsFocused)
                {
                    CurrentFocused.IsFocused = false;
                    CurrentFocused = this;
                }
                else
                {
                    CurrentFocused = this;
                }
            }
        }


        public NodeControl()
        {
            InitializeComponent();

            transform.X = 5500;
            transform.Y = 5200;
            renderTransform.AddValueChanged(this, NodeControlPositionChanged);
            this.RenderTransform = transform;


            /*
            var mediaColorBrushBlack = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
            System.Drawing.Color colorBlack = System.Drawing.Color.FromArgb(mediaColorBrushBlack.Color.A,
                                                         mediaColorBrushBlack.Color.R,
                                                         mediaColorBrushBlack.Color.G,
                                                         mediaColorBrushBlack.Color.B);
            */

            mainBorder.BorderBrush = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];

        }

        private void NodeControlPositionChanged(object sender, EventArgs e)
        {
            OnPositionChanged?.Invoke(sender, e);
        }

        private void NodeControlPreviewMouseMove(object sender, MouseEventArgs e)
        {
            if (isInDrag)
            {
                //this.Margin = new Thickness(e.GetPosition(Parent as Grid).X - clickLocalPosition.X, e.GetPosition(Parent as Grid).Y - clickLocalPosition.Y, 0, 0);
                currentPoint = e.GetPosition(Parent as Grid);

                transform.X += (currentPoint.X - anchorPoint.X);
                transform.Y += (currentPoint.Y - anchorPoint.Y);
                this.RenderTransform = transform;

                anchorPoint = currentPoint;

                //временно
                //((((Parent as Grid).Parent as Grid).Parent as Viewbox).Parent as ScrollViewer).ScrollToVerticalOffset(transform.Y);
                //connectionLine.X2 = e.GetPosition(Parent as Grid).X - clickLocalPosition.X;
                //connectionLine.Y2 = e.GetPosition(Parent as Grid).Y - clickLocalPosition.Y;

            }

        }

        private void NodeControlMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                FrameworkElement frameworkElement = Mouse.DirectlyOver as FrameworkElement;
                Type directlyOverType = frameworkElement?.GetType();
                if (directlyOverType == null || (directlyOverType.Name != "TextBoxView" &&
                                                 directlyOverType != typeof(Slider) &&
                                                 directlyOverType != typeof(Button) &&
                                                 directlyOverType != typeof(CheckBox) &&
                                                 directlyOverType != typeof(ComboBox) &&
                                                 directlyOverType != typeof(Slider) &&
                                                 directlyOverType != typeof(ScrollViewer) &&
                                                 directlyOverType != typeof(ScrollBar) &&
                                                 directlyOverType != typeof(TextBox)))
                {
                    anchorPoint = e.GetPosition(Parent as Grid);
                    this.CaptureMouse();
                    isInDrag = true;
                }
            }

        }

        private void NodeControlMouseUp(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Released)
            {
                if (isInDrag)
                {
                    this.ReleaseMouseCapture();
                    isInDrag = false;
                }
            }

        }

        private void UserControl_GotFocus(object sender, RoutedEventArgs e)
        {
            IsFocused = true;
        }

        private void UserControl_LostFocus(object sender, RoutedEventArgs e)
        {
            IsFocused = false;
        }

        private void UserControl_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                UserControl_GotFocus(this, null);
            }

        }
    }
}
